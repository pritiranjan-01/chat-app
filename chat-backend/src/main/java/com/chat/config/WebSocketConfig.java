package com.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // topic/messages
        registry.enableSimpleBroker("/topic");

        // /app/chat
        // It transfers request coming with prefix /app to controller @MessagingMapping(/chat)
        registry.setApplicationDestinationPrefixes("/app");
    }


    // Server side handshaking happens here.
    // This is the endpoint which will be used by the client to connect to the server 
    // and using this endpoint we will create a websocket connection.
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat") // connection establishment
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

}
