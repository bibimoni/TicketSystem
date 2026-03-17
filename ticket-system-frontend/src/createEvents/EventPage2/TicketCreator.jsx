import React, { useEffect, useContext, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd'; 
import { EventContext } from '../../context/EventContext';
import line13 from "../../Elements/line-13.svg";
import line14 from "../../Elements/line-14.svg";

export default function TicketCreator({ editingTicket, setEditingTicket }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setEventData } = useContext(EventContext);
  
  const [form] = Form.useForm(); 

  useEffect(() => {
    if (editingTicket) {
      form.setFieldsValue(editingTicket);
      setIsModalOpen(true);
    }
  }, [editingTicket, form]);

  const closeAndReset = () => {
    setIsModalOpen(false);
    form.resetFields(); 
    setEditingTicket(null);
  };

  // Hàm này chỉ chạy khi form đã vượt qua MỌI điều kiện validation
  const onFinish = (values) => {
    if (editingTicket) {
      // Cập nhật vé cũ
      const updatedTicket = { ...editingTicket, ...values };
      setEventData(prevData => ({
        ...prevData,
        tickets: prevData.tickets.map(t => t.id === editingTicket.id ? updatedTicket : t)
      }));
    } else {
      // Tạo vé mới
      const newTicket = { ...values, id: Date.now() };
      setEventData(prevData => ({
        ...prevData,
        tickets: [...(prevData.tickets || []), newTicket]
      }));
    }
    closeAndReset();
  };

  return (
    <div>
      <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
        <div className="w-8 h-8 relative bg-[#f94f2f] rounded-2xl">
          <img className="absolute top-1 left-[15px] w-0.5 h-[23px]" alt="Line" src={line13} />
          <img className="absolute top-[15px] left-1 w-[23px] h-0.5" alt="Line" src={line14} />
        </div>
        <div className="mt-1.5 font-semibold text-[#f94f2f] text-base">Tạo vé</div>
      </div>

      <Modal 
        title={<h2 className="text-[#f94f2f] text-center text-lg font-bold">Tạo vé</h2>}
        open={isModalOpen} 
        onCancel={closeAndReset}
        footer={null} 
        centered
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          initialValues={{ minTickets: 1, maxTickets: 2 }} 
        >
          <Form.Item 
            label="Tên vé" 
            name="ticketName" 
            rules={[{ required: true, message: 'Vui lòng nhập tên vé!' }]} 
          >
            <Input placeholder="Nhập tên vé" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              label="Giá vé" 
              name="ticketPrice"
              rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
              <InputNumber className="w-full" placeholder="VD: 3000000" formatter={value => `${value}đ`} />
            </Form.Item>

            <Form.Item label="Số lượng vé" name="ticketQuantity">
              <InputNumber className="w-full" min={1} placeholder="VD: 100" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Tối thiểu/đơn" name="minTickets">
              <InputNumber className="w-full" disabled />
            </Form.Item>
            <Form.Item label="Tối đa/đơn" name="maxTickets">
              <InputNumber className="w-full" disabled />
            </Form.Item>
          </div>

          <Form.Item label="Thông tin vé" name="ticketInfo">
            <Input.TextArea rows={4} placeholder="VD: Khu vực dành cho khán giả trên 13 tuổi..." />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full bg-[#ff3b30] hover:bg-[#e13229] border-none h-10 font-semibold text-base">
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
