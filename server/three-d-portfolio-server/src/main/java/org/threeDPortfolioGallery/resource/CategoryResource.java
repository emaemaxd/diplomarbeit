package org.threeDPortfolioGallery.resource;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.threeDPortfolioGallery.repos.CategoryRepo;
import org.threeDPortfolioGallery.workloads.Category;

import java.util.List;

/**
 * Controller Klasse, um Categories zu verwalten mittels REST-Endpoints. Diese Endpoints ermöglichen CRUD der Tabelle Category.
 * Die REST-Schnittstellen sind über <a href="http://localhost:8080/api/category">http://localhost:8080/api/category</a> erreichbar.
 *
 * @author Ema Halilovic
 */
@Path("/api/category")
@Produces(MediaType.APPLICATION_JSON)
public class CategoryResource {
    @Inject
    CategoryRepo categoryRepo;

    /**
     * Gibt alle vorhandenen Categories zurück.
     * Alle Categories werden aus der Datenbank ausgelesen mittels
     *
     * @return Eine Response mit HTTP-Statuscode 200 + eine Entität mit allen Categories <i>oder</i> HTTP-Statuscode 204 (no Content).
     */
    @GET
    @PermitAll
    @Path("/all")
    public Response getAllCategories(){
        try{
            List<Category> categories = categoryRepo.listAll();
            if (categories.isEmpty()){
                return Response.noContent().build();
            } else {
                return Response.ok().entity(categories).build();
            }
        }catch (Exception e){
            return Response.status(500, "hi").build();
        }
    }
}
