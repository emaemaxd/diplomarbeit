package org.threeDPortfolioGallery.resource;

import org.threeDPortfolioGallery.repos.ThemeRepo;
import org.threeDPortfolioGallery.workloads.Theme;

import jakarta.annotation.security.PermitAll;

import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Controller Klasse, um Themen zu verwalten mittels REST-Endpoints. Diese Endpoints ermöglichen CRUD der Tabelle Theme.
 * Die REST-Schnittstellen sind über http://localhost:8080/api/themes erreichbar.
 */
@Path("api/themes")
@Produces(MediaType.APPLICATION_JSON)
public class ThemeResource {

    @Inject
    ThemeRepo themeRepo;

    /**
     * Gibt alle in der Datenbank gespeicherten Themen zurück
     * @return Liste von allen Themen
     */
    @GET
    public List<Theme> getAll(){
        return themeRepo.listAll();
    }
}
