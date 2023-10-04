package org.threeDPortfolioGallery.resource;

import org.threeDPortfolioGallery.repos.ExhibitRepo;
import org.threeDPortfolioGallery.workloads.Exhibit;

import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Controller Klasse, um Exhibits zu verwalten mittels REST-Endpoints. Diese Endpoints ermöglichen CRUD der Tabelle Exhibit.
 * Die REST-Schnittstellen sind über <a href="http://localhost:8080/api/exhibits">http://localhost:8080/api/exhibits</a> erreichbar.
 *
 * @author Ema Halilovic
 */
@Path("api/exhibits")
@Produces(MediaType.APPLICATION_JSON)
public class ExhibitResource {

    @Inject
    public ExhibitRepo exhibitRepo;

    /**
     * Gibt einen Raum nach Id zurück
     *
     * HTTP-GET-Methode, die ein Exhibit liefert passend zur übergebenen Id.
     *
     * @param id Eindeutige nummerischer Wert für die Id eines Exhibits. Diese wird in der URL mitgegeben.
     * @return Eine Response mit HTTP-Statuscode 200 + das zugehörige Exhibit <i>oder</i> HTTP-Statuscode 204 (no Content).
     */
    @GET
    @Path("/{exhibitId}")
    public Response getExhibitById(@PathParam("exhibitId") Long id) {
        Exhibit exhibit = exhibitRepo.findById(id);
        if(exhibit == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibit).build();
        }
    }
}