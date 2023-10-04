package org.threeDPortfolioGallery.resource;

import org.threeDPortfolioGallery.repos.RoomRepo;
import org.threeDPortfolioGallery.workloads.Room;
import org.threeDPortfolioGallery.workloads.dto.ReturnRoomDTO;

import jakarta.annotation.security.PermitAll;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

/**
 * Controller Klasse, um User zu verwalten mittels REST-Endpoints. Diese Endpoints ermöglichen CRUD der Tabelle User.
 * Die REST-Schnittstellen sind über <a href="http://localhost:8080/api/rooms">http://localhost:8080/api/rooms</a> erreichbar.
 */
@Path("/api/rooms")
@Produces(MediaType.APPLICATION_JSON)
public class RoomResource {

    @Inject
    RoomRepo roomRepo;

    /**
     * Gibt alle Räume zurück.
     *
     * Diese Methode wird verwendet, um in der Datenbank gespeicherte Räume abzurufen. Die Räume werden mittels {@link RoomRepo} Klasse abgerufen.
     * Dafür hilft die Methode <b>.listAll()</b> von {@link io.quarkus.hibernate.orm.panache.PanacheRepository}.
     *
     * @return Eine Response mit HTTP-Statuscode 200 + eine Entität mit allen Räumen <i>oder</i> HTTP-Statuscode 204 (no Content).
     */
    @GET
    @Path("/all")
    public Response getAllRooms(){
        var rooms = roomRepo.listAll();
        if(rooms == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(rooms).build();
        }
    }

    /**
     * Gibt den Raum der übergebenen Id zurück.
     *
     * Diese Methode gibt einen Raum zurück, der dieselbe Id hat, wie der übergebene Wert. Die Methode funktioniert mittels der HTTP-Methode GET.
     *
     * @param id Eindeutige nummerischer Wert für die Id eines Raumes. Diese wird in der URL mitgegeben
     * @return Eine Response mit HTTP-Statuscode 200 + den zugehörigen Raum <i>oder</i> HTTP-Statuscode 204 (no Content).
     */
    @GET
    @Path("/getById/{roomid}")
    public Response getRoomById(@PathParam("roomid") Long id){
        Room room = roomRepo.findById(id);
        if(room == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(room).build();
        }
    }

    /**
     * Liefert alle Räume mit Positionen.
     *
     * Diese Methode gibt alle Räume zurück mit den darin festgelegten {@link org.threeDPortfolioGallery.workloads.Position}-Objekten. Die Methode funktioniert mittels HTTP-Methode GET.
     *
     * @return Eine Response mit HTTP-Statuscode 200 + {@link Room} und dessen {@link org.threeDPortfolioGallery.workloads.Position} <i>oder</i> HTTP-Statuscode 204 (no Content).
     */
    @GET
    @Path("/allRoomPositions")
    public Response getAllRoomsRecords(){
        List<ReturnRoomDTO> rooms = roomRepo.getAllRoomsWithPositions();
        if(rooms == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(rooms).build();
        }
    }
}
