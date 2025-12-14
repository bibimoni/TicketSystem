import { useState, useEffect } from 'react';

/**
 * Đây là một "Custom Hook" để quản lý logic xem trước ảnh.
 * Nó đóng gói tất cả state và hàm xử lý liên quan đến ảnh.
 */
export const useImagePreview = () => {
  // State để lưu file người dùng đã chọn (để gửi lên server)
  const [selectedFile, setSelectedFile] = useState(null);
  
  // State để lưu URL tạm thời (để hiển thị ảnh)
  const [previewUrl, setPreviewUrl] = useState(null);

  // Hàm xử lý khi người dùng chọn file
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      // Khi file mới được chọn, tạo một URL tạm thời cho nó
      // State 'previewUrl' sẽ được cập nhật, kích hoạt useEffect
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ⚠️ Quan trọng: Dọn dẹp bộ nhớ
  // Chúng ta dùng useEffect để dọn dẹp URL tạm thời (Object URL)
  // khi component bị gỡ (unmount) hoặc khi một ảnh mới được chọn.
  useEffect(() => {
    // Lưu URL hiện tại vào một biến
    const currentUrl = previewUrl;

    // Trả về một hàm "cleanup"
    return () => {
      // Hàm này sẽ chạy TRƯỚC khi effect chạy lại (vì previewUrl thay đổi)
      // HOẶC khi component bị gỡ bỏ
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl); // Thu hồi URL cũ
      }
    };
  }, [previewUrl]); // Chạy lại effect này mỗi khi 'previewUrl' thay đổi

  // Trả về state và hàm xử lý để component có thể sử dụng
  return { previewUrl, selectedFile, handleImageChange };
};