package org.threeDPortfolioGallery.resource;

import io.quarkus.security.credential.Credential;
import org.threeDPortfolioGallery.JwtService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/jwt")
@ApplicationScoped
public class AuthResource {

    // TODO JAVADOC
    @Inject
    JwtService jwtService;

    // maybe muss das geändert werden?
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response getJwt(){
        String jwt = jwtService.generateJwt();
        return Response.ok(jwt).build();
    }
}
