package com.mohammad.lychee.lychee.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("My API")
                        .version("1.0.0")
                        .description("This is the default Swagger configuration for the application.")
                        .contact(new Contact()
                                .name("Mohammad")
                                .email("mohammad@example.com")
                                .url("https://example.com")
                        )
                );
    }
}
