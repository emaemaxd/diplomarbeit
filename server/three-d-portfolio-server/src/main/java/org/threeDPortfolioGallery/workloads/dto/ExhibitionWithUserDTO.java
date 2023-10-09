package org.threeDPortfolioGallery.workloads.dto;

import lombok.Data;
import org.threeDPortfolioGallery.workloads.Exhibition;

@Data
public class ExhibitionWithUserDTO {
    Exhibition exhibition;
    String user_name;
    String user_icon_url;

    public ExhibitionWithUserDTO(Exhibition exhibition, String user_name, String user_icon_url) {
        this.exhibition = exhibition;
        this.user_name = user_name;
        this.user_icon_url = user_icon_url;
    }
}


