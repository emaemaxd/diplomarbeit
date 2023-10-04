package org.threeDPortfolioGallery.repos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.threeDPortfolioGallery.workloads.Position;


@ApplicationScoped
public class PositionRepo implements PanacheRepository<Position> { }
