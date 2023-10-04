package org.threeDPortfolioGallery.workloads.dto;

import lombok.Data;

@Data
public class AddExhibitDTO {
    String data_type;
    String description;
    String title;
    String url;
    int scale;
    String alignment;

    Long theme_id;
    Long position_id;
}
