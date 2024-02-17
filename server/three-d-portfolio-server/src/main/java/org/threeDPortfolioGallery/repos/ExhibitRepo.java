package org.threeDPortfolioGallery.repos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.threeDPortfolioGallery.workloads.Exhibit;
import org.threeDPortfolioGallery.workloads.Exhibition;

import jakarta.enterprise.context.ApplicationScoped;

import java.io.File;
import java.util.List;

@ApplicationScoped
public class ExhibitRepo implements PanacheRepository<Exhibit> {
    static String filepath = "/target/files/";
    public void postExhibits(List<Exhibit> exhibits, Exhibition exhibition){
        for (Exhibit i: exhibits) {
            i.exhibition = exhibition;
            getEntityManager().persist(i);
        }
    }

    public boolean deleteExhibitsWithFile(Exhibit exhibit){
        File file = new File(filepath + exhibit.url);
        if (file.exists()){
            file.delete();
            return true;
        } else {
            return false;
        }
    }
}
