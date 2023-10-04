package org.threeDPortfolioGallery.repos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.threeDPortfolioGallery.workloads.Category;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CategoryRepo implements PanacheRepository<Category> {


}
