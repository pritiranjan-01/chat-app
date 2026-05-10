package com.chat.controller;

import com.chat.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/r2")
public class FileUploadController {
    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        return fileUploadService.upload(file);
    }

    @DeleteMapping("/delete")
    public Boolean deleteFile(@RequestParam String imgUrl) {
        return fileUploadService.delete(imgUrl);
    }

}
