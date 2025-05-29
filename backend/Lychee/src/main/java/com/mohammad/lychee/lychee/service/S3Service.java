package com.mohammad.lychee.lychee.service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = folder + "/" + UUID.randomUUID().toString() + extension;

        // Set metadata
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        // Upload to S3
        PutObjectRequest putObjectRequest = new PutObjectRequest(
                bucketName, fileName, file.getInputStream(), metadata);

        s3Client.putObject(putObjectRequest);

        // Return the public URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s",
                bucketName, "eu-north-1", fileName);
    }

    public void deleteFile(String fileUrl) {
        try {
            // Extract key from URL
            String key = fileUrl.substring(fileUrl.lastIndexOf(".com/") + 5);
            s3Client.deleteObject(bucketName, key);
        } catch (Exception e) {
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }
}