// import { ApiProperty } from "@nestjs/swagger"
// import { IsString, MinLength } from "class-validator"
// import { event_format } from "generated/prisma"

// export class CreateEventDto {
//   @ApiProperty({
//     example: 'The Vietnam Concert'
//   })
//   @IsString()
//   @MinLength(6)
//   name: string

//   @ApiProperty({
//     example: 'ONLINE'
//   })
//   @IsString()
//   @MinLength(6)
//   format: event_format


//   @ApiProperty({
//     example: '68ea6fb86acf163f42a91c2a'
//   })
//   @IsString()
//   admin_id: string

//   @ApiProperty({
//     example: '68ea6756dfe71b734e5907b0'
//   })
//   @IsString()
//   customer_id: string

//   @ApiProperty({
//     example: '2025-10-20T18:30:00+07:00',
//     description: 'Ticket sell start date and time'
//   })
//   eventTicketStart: Date

//   @ApiProperty({
//     example: '2025-11-20T18:30:00+07:00',
//     description: 'Ticket sell end date and time'
//   })
//   eventTicketEnd: Date
// }