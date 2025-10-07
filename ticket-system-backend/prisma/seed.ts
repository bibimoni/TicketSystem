import { faker } from '@faker-js/faker';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

console.log('--- Seeding with the following connection string: ---');
console.log(process.env.MONGO_URI);
console.log('--------------------------------------------------');

async function main() {
  console.log('--- Seeding started ---');

  console.log('Clearing existing data...');
  // await prisma.transactionHasTicket.deleteMany();
  // await prisma.transactionApplyVoucher.deleteMany();
  // await prisma.transaction.deleteMany();
  // await prisma.ticket.deleteMany();
  // await prisma.event.deleteMany();
  // await prisma.customer.deleteMany();
  // await prisma.admin.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.ticketPrice.deleteMany();
  // await prisma.voucher.deleteMany();
  // console.log('Database cleared.');

  console.log('Seeding users...');
  const users = Array.from({ length: 20 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    sex: faker.person.sex(),
    address: faker.location.streetAddress(),
    birth_date: faker.date.birthdate(),
    information: faker.lorem.sentence(),
    phone_number: faker.phone.number(),
    hashed_password: 'hashed-password-placeholder', // Always hash passwords properly
    username: faker.internet.username().toLowerCase() + faker.string.alphanumeric(4),
  }));
  console.log(users);
  await prisma.user.createMany({ data: users });
  console.log('Seeded 20 users.');

  console.log('Seeding ticket prices...');
  const ticketPrices = Array.from({ length: 5 }, () => ({
    name: faker.commerce.productAdjective() + ' Ticket',
    price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
    benefit_info: faker.lorem.sentence(),
  }));
  await prisma.ticketPrice.createMany({ data: ticketPrices });
  console.log('Seeded 5 ticket prices.');

  console.log('Seeding vouchers...');
  const vouchers = Array.from({ length: 10 }, () => ({
    reduce_type: faker.helpers.arrayElement(['PERCENT', 'FIXED']),
    reduce_price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
    amount: faker.number.int({ min: 10, max: 100 }),
    price: parseFloat(faker.commerce.price({ min: 1, max: 10 })),
    start_date: faker.date.past(),
    end_date: faker.date.future(),
  }));
  await prisma.voucher.createMany({ data: vouchers });
  console.log('Seeded 10 vouchers.');

  const createdUsers = await prisma.user.findMany();

  console.log('Seeding admins and customers...');
  const customers = createdUsers.slice(0, 5).map(user => ({ user_id: user.id }));
  await prisma.customer.createMany({ data: customers });

  const admins = createdUsers.slice(5, 7).map(user => ({ user_id: user.id }));
  await prisma.admin.createMany({ data: admins });
  console.log('Seeded 5 customers and 2 admins.');

  const createdAdmins = await prisma.admin.findMany();
  const createdCustomers = await prisma.customer.findMany();

  console.log('Seeding events...');
  const events = Array.from({ length: 8 }, () => ({
    information: faker.company.catchPhrase(),
    destination: faker.location.city(),
    organizer: faker.company.name(),
    admin_id: createdAdmins[Math.floor(Math.random() * createdAdmins.length)].id,
    customer_id: createdCustomers[Math.floor(Math.random() * createdCustomers.length)].id,
    eventTimes: [faker.date.soon(), faker.date.future()],
    eventTicketTimes: faker.date.soon(),
  }));
  await prisma.event.createMany({ data: events });
  console.log('Seeded 8 events.');

  const createdEvents = await prisma.event.findMany();
  const createdTicketPrices = await prisma.ticketPrice.findMany();

  console.log('Seeding tickets...');
  const tickets = Array.from({ length: 100 }, () => ({
    status: faker.helpers.arrayElement(['AVAILABLE', 'SOLD', 'RESERVED']),
    seat: `${faker.string.alpha(1).toUpperCase()}${faker.number.int({ min: 1, max: 20 })}`,
    amount: 1,
    event_id: createdEvents[Math.floor(Math.random() * createdEvents.length)].id,
    ticket_price_id: createdTicketPrices[Math.floor(Math.random() * createdTicketPrices.length)].id,
  }));
  await prisma.ticket.createMany({ data: tickets });
  console.log('Seeded 100 tickets.');

  console.log('Seeding transactions...');
  for (const customer of createdCustomers) {
    const numTransactions = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numTransactions; i++) {
      const transaction = await prisma.transaction.create({
        data: {
          time_date: faker.date.past(),
          method: 'Credit Card',
          price_before_voucher: 0,
          total_price: 0,
          customer_id: customer.id,
        },
      });

      const numTickets = faker.number.int({ min: 1, max: 4 });
      const availableTickets = await prisma.ticket.findMany({ where: { status: 'AVAILABLE' }, take: numTickets });

      let totalPrice = 0;
      for (const ticket of availableTickets) {
        await prisma.transactionHasTicket.create({
          data: {
            transaction_id: transaction.id,
            ticket_id: ticket.id,
            amount: 1,
          },
        });
        const ticketPrice = await prisma.ticketPrice.findUnique({ where: { id: ticket.ticket_price_id } });
        totalPrice += ticketPrice?.price || 0;

        await prisma.ticket.update({ where: { id: ticket.id }, data: { status: 'SOLD' } });
      }

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          price_before_voucher: totalPrice,
          total_price: totalPrice,
        },
      });
    }
  }
  console.log('Seeded transactions with tickets.');

  console.log('---  Seeding finished successfully! ---');
}

main()
  .catch((e) => {
    console.error('An error occurred while seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

