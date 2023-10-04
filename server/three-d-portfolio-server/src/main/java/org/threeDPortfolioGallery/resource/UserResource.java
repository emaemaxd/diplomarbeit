package org.threeDPortfolioGallery.resource;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.UriInfo;
import org.threeDPortfolioGallery.JwtService;
import org.threeDPortfolioGallery.repos.UserRepo;
import org.threeDPortfolioGallery.workloads.User;
import org.threeDPortfolioGallery.workloads.dto.UserLoginDTO;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.Base64;

/**
 * Controller Klasse, um User zu verwalten mittels REST-Endpoints. Diese Endpoints ermöglichen CRUD der Tabelle User.
 */
@Path("/api/users")
public class UserResource {

    @Inject
    UserRepo userRepo;

    @Inject
    JwtService jwtService;

    /**
     * Gibt den Nutzer der mitgegebenen Id zurück
     * @param id Nummer des gesuchten Benutzers
     * @return JSON-Objekt des Benutzers
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{user_id}")
    public Response getUser(@PathParam("user_id") long id) {
            User user = userRepo.findById(id);
            if (user == null){
                return Response.noContent().build();
            }else {
                return Response.ok().entity(user).build();
            }
    }

    /**
     *
     * @param new_user JSON object
     * @param uriInfo
     * @return
     */
    @POST
    @Transactional
    @Consumes("application/json")
    @Produces("application/json")
    @Path("/new")
    public Response postUser(User new_user, @Context UriInfo uriInfo) {
        new_user.password = hashPassword(new_user.password);
        User user = User.create(new_user.user_name, new_user.email, new_user.icon_url, new_user.password,  new_user.exhibitions);
        this.userRepo.persist(user);
        URI uri = uriInfo.getAbsolutePathBuilder().path(Long.toString(user.id)).build();
        return Response.created(uri).build();
    }

    /**
     * Eine private Methode, die dafür da ist den übergebenen Parameter zu salten und hashen.
     * @param string beliebiges Wort, was geändert werden soll
     * @return abgeänderter Parameter
     */
    private String hashPassword(String string){
        string = string + "yoyoyo";
        Base64.Encoder encoder = Base64.getEncoder();
        return encoder.encodeToString(string.getBytes());
        // return password.concat("hi");
    }

    @PermitAll
    @POST
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/login")
    public Response login(UserLoginDTO loginDTO){
        String token;
        User user = null;
        // first hash password
        loginDTO.setPassword(this.hashPassword(loginDTO.getPassword()));

        // then find user
        // return ((this.userRepo.isUser(loginDTO))? Response.ok("{'token':'Test'}") : Response.status(401)).build();
        try {
            user = userRepo.find("(user_name=?1 or email=?2) and password=?3", loginDTO.getEmailOrUsername(), loginDTO.getEmailOrUsername(), loginDTO.getPassword()).singleResult();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        if (user != null) {
            return Response.ok(jwtService.generateJwt(user.id)).build();
        }else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Sucht nach einem Nutzer mit der übergebenen Id und löscht diesen.
     * @param id nimmt einen Long
     * @return Response 204 falls alles funktioniert hat <i>oder</i>
     *          Response 406, falls eine nicht-existente Id übergeben wurde.
     */
    @DELETE
    @Transactional
    @Path("{userid}")
    public Response deleteUser(@PathParam("userid")Long id){
        if(id > 0){
            var i = userRepo.deleteById(id);
            if (i){
                return Response.noContent().build();
            }
        }
        return Response.status(406).build();
    }
}
