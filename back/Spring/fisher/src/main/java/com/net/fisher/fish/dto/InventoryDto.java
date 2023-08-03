package com.net.fisher.fish.dto;

import com.net.fisher.fish.entity.Fish;
import lombok.*;

public class InventoryDto {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Post{
        private String fishCode;
        private double size;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class SingleResponse {
        private long inventoryId;
        private Fish fish;
        private double size;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MultiResponse{
        private long inventoryId;
        private String fishCode;
        private String fishName;
        private double fishSize;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class Delete{
        private long inventoryId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class Info {
        private int count;
        private double maxSize;
    }
}
