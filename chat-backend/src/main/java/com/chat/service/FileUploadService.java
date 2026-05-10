package com.chat.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    String upload(MultipartFile file);
    Boolean delete(String imgURL);
}
