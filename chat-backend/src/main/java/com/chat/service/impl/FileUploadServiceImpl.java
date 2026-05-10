package com.chat.service.impl;

import com.chat.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${r2.bucket.name}")
    private String bucketName;

    @Value("${r2.public.url}")                          // ✅ Added
    private String r2PublicUrl;

    private final S3Client s3Client;

    @Override
    public String upload(MultipartFile file) {

        final String folderName = "profile-assets";

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        String key = folderName + "/" + UUID.randomUUID() + "." + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    // ✅ Removed .acl("public-read") — R2 doesn't support ACLs
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            if (response.sdkHttpResponse().isSuccessful()) {
                return r2PublicUrl + "/" + key;         // ✅ R2 public URL format
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload failed");
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    public Boolean delete(String imgURL) {
        String key = imgURL.replace(r2PublicUrl + "/", "");  // ✅ Uses R2 public URL

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        try {
            DeleteObjectResponse response = s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}