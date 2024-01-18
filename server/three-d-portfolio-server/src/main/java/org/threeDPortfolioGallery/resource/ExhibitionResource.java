package org.threeDPortfolioGallery.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.MultivaluedMap;
import org.apache.commons.io.IOUtils;
import org.apache.tika.Tika;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.threeDPortfolioGallery.repos.*;
import org.threeDPortfolioGallery.workloads.*;
import org.threeDPortfolioGallery.workloads.dto.AddExhibitDTO;
import org.threeDPortfolioGallery.workloads.dto.AddExhibitionDTO;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO;

import io.quarkus.runtime.StartupEvent;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * Controller-Klasse, um Exhibitions zu verwalten mittels REST-Endpoints. Diese Endpoints ermöglichen CRUD der Tabelle Exhibition.
 * Die REST-Schnittstellen sind aufrufbar unter <a href="http://localhost:8080/api/exhibitions">http://localhost:8080/api/exhibitions</a>
 *
 * @author Ema Halilovic
 */
@Path("api/exhibitions")
@Produces(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class ExhibitionResource {
// TODO remove Cache-Dependency in pom.xml
    // TODO JAVADOC
    /**
     * Diese Variable stellt sicher, dass jedes hochgeladene File einen einzigartigen Namen hat.
     */
    int fileCount = 0;

    /**
     * Diese Variable definiert den Pfad, in dem alle Files gespeichert werden. Der Wert wird nie geändert.
     */
    @ConfigProperty(name="three-d.file.upload.path")
    String FILE_PATH;
    
    @Inject
    ExhibitionRepo exhibitionRepo;
    @Inject
    UserRepo userRepo;
    @Inject
    ThemeRepo themeRepo;

    @Inject
    PositionRepo positionRepo;

    @Inject
    CategoryRepo categoryRepo;
    @Inject
    RoomRepo roomRepo;

    @Inject
    ExhibitRepo exhibitRepo;

    @Inject
    Logger log;

    void init(@Observes StartupEvent ev) {
        var path = Paths.get(FILE_PATH).toAbsolutePath();
        log.infof("create upload file folder %s", path.toString());
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            log.error("failed to create upload file folder", e);
        }
    }
    /**
     * HTTP-Methode GET zum Download von Dateien.
     * Mitgegeben wird der Name + zugehöriger Ordner des benötigten Files.
     * Die genauen Pfade sind gespeichert in der Datenbank oder werden beim Fileupload zurückgegeben.
     *
     * @param fileName Der Name des Files, sowie der Ordner-Pfad davor base path ist auf files/
     * @return Response code 200 mit dem FileStream <i>oder</i> HTTP-Statuscode No Content
     */
    @GET
    @Path("/download/{exhibition}/{fileName}")
    public Response downloadFile(@PathParam("exhibition") String exhibition, @PathParam("fileName") String fileName)
    throws IOException {
        var file = java.nio.file.Path.of(FILE_PATH, exhibition, fileName);
        log.infof("try to download %s (FILE_PATH=%s)", file.toFile().getAbsolutePath(), FILE_PATH);
        var response = Response.noContent().entity(String.format("file '%s' not found", file.toAbsolutePath().getFileName()));
        if (Files.exists(file)) {
            var tika = new Tika();
            try (var fileStream = Files.newInputStream(file)) {
                var mimeType = tika.detect(file.toFile());
                response = Response
                    .ok(file.toFile())
                    .header("Content-Type", mimeType)
                    .header("Content-Disposition", "attachment; filename=" + fileName);
            }
        }
        return response.build();
    }

    /**
     * Eine GET-Methode zum anzeigen von Bildern, für einfachere Verwendung in der Datenbank.
     * @param fileName aus der Datenbank
     * @return Bild
     */
    @GET
    @Path("/downloadImageFile/{exhibition}/{fileName}")
    @Produces({"image/png"})
    public Response downloadImageFile(@PathParam("exhibition") String exhibition, @PathParam("fileName") String fileName) {
        File file = new File(FILE_PATH + exhibition + "/" + fileName);
        System.out.println(FILE_PATH + exhibition + "/" + fileName);
        if (!file.exists()) {
            return Response.noContent().entity("file not found").build();
        }
        return Response.ok(file).header("Content-Disposition", "inline;filename=" + fileName).build();
    }

    /**
     * Zum Hochladen der Exhibition-Dateien
     * @param input Blob aus dem Frontend, beliebige Datei
     * @return
     */
    @POST
    @Path("/upload")
    @Consumes("multipart/form-data")
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public Response uploadFile(MultipartFormDataInput input) {
        String fileName = "";
        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("uploadedFile");
        if(inputParts != null) {
            for (InputPart inputPart : inputParts) {
                try {
                    MultivaluedMap<String, String> header = inputPart.getHeaders();
                    fileName = "file" + fileCount + getFileName(header);
                    InputStream inputStream = inputPart.getBody(InputStream.class, null);
                    // System.out.println(fileName);
                    // Exhibit ex = new Exhibit(postURL, "png", "test", "desc");
                    // PictureEntity picture = new PictureEntity(postURL, "");
                    // exhibitRepo.persist(ex);
                    byte[] bytes = IOUtils.toByteArray(inputStream);
                    var fileName2 = FILE_PATH + "upload/" + fileName;
                    log.infof("save uploaded file as %s", fileName2);
                    writeFile(bytes, fileName2);
                    fileCount++;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return Response.status(200).entity("upload/" + fileName).build();
        } else {
            return Response.status(401).entity("something went wrong").build();
        }
    }

    private String getFileName(MultivaluedMap<String, String> header) {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition) {
            // System.out.println(filename);  => name="uploadedFile" filename="WhatsApp Image 2022-05-04 at 10.20.19.jpeg"
            if ((filename.trim().startsWith("filename"))) {
                String[] name = filename.split("="); // => [ filename, "WhatsApp Image 2022-05-04 at 10.20.19.jpeg"]
                String nameToReturn = name[1].trim().replaceAll("\"", "");
                return nameToReturn.replaceAll(" ","");
            }
        }
        return "unknown";
    }
    private void writeFile(byte[] content, String filename) throws IOException {
        File file = new File(filename);
        if (!file.exists()) {
            file.createNewFile();
        }
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(content);
        fos.flush();
        fos.close();
    }

    /**
     * Gibt Exhibition zurück nach Id
     * @param id Long
     * @return 1 Exhibition
     */
    @GET
    @Path("/{exhibitionId}")
    public Response getExhibitionById(@PathParam("exhibitionId") Long id){
        Exhibition exhibition = exhibitionRepo.findById(id);
        if(exhibition == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibition).build();
        }
    }

    /**
     * REST Schnittstelle für alle Exhibitions für die angegebene Id eines Users
     * @param id gesuchter User
     * @return alle gefundenen Exhibitions für
     */
    @GET
    //@RolesAllowed({"admin"})
    @Path("/getByUserId/{userId}")
    public Response getExhibitionsByUser(@PathParam("userId") long id){
        List<Exhibition> exhibitions = exhibitionRepo.getAllExhibitionsForUser(id);
        if(exhibitions == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibitions).build();
        }
    }

    /**
     * REST Schnittstelle, um alle Exhibitions zurückgeliefert zu bekommen
     * @return Response 200 und alle Exhibitions
     *         oder Response 204, falls keine Exhibitions gefunden wurden
     */
    @GET
    @Path("/all")
    public Response getAllExhibitions(){
        List<ExhibitionWithUserDTO> exhibitionSet = exhibitionRepo.listAllExhibitionsWithUserField();
        if(exhibitionSet.isEmpty()){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibitionSet).build();
        }
    }

    /**
     * REST Schnittstelle, die nach einem Begriff im Titel oder im Username der Exhibition sucht
     * @param searchTerm gesuchter Begriff
     * @return Response 200 und alle Exhibitions, welche dem gesuchten Begriff entsprechen
     *         oder 204, falls keine Exhibitions gefunden wurden
     */
    @GET
    @Path("/search/{searchTerm}")
    public Response getExhibitionsBySearchTerm(@PathParam("searchTerm") String searchTerm){
        List<ExhibitionWithUserDTO> exhibitions = exhibitionRepo.listAllBySearchTerm(searchTerm);
        if(exhibitions == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibitions).build();
        }
    }

    /**
     * REST-Schnittstelle, die die letzten 5 hinzugefügten Exhibitions liefert
     *
     * @return  Response 200 und 5 Exhibitions
     *                   oder 204, falls keine Exhibitions gefunden wurden
     */
    @GET
    @PermitAll
    @Path("/latestFive")
    public Response getLastFiveExhibitions(){
        List<ExhibitionWithUserDTO> exhibitions = exhibitionRepo.getLatestFive();
        if(exhibitions == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibitions).build();
        }
    }

    /**
     * REST-Schnittstelle, die alle Exhibitions zu der gesuchten Category Id zurückgibt
     *
     * @param id Long id der Category
     * @return  Response 200 und alle Exhibitions der angegebenen Category
     *          oder Response 204
     */
    @GET
    @Path("/getByCategoryId/{categoryId}")
    public Response getExhibitionByCategory(@PathParam("categoryId") Long id){
        List<ExhibitionWithUserDTO> exhibitions = exhibitionRepo.getByCategoryId(id);
        if(exhibitions == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibitions).build();
        }
    }

    @GET
    @PermitAll
    @Path("/getByCategoryIds/{categoryIds}")
    public Response getExhibitionsByCategories(@PathParam("categoryIds") String categoryIds){
        String[] ids = categoryIds.split(",");
        List<Long> longIds = new LinkedList<>();
        for (String id : ids) {
            longIds.add(Long.parseLong(id));
        }
        List<ExhibitionWithUserDTO> exhibitions = exhibitionRepo.getByCategoryIds(longIds);
        if(exhibitions == null){
            return Response.noContent().build();
        } else {
            return Response.ok().entity(exhibitions).build();
        }
    }

    // TODO fix code duplication
    // TODO die @OneToOne exhibit - position beziehung geht ned, weil one to one aber mehrere entries usw. muss man fixen, prolly mit composite key oder so a schmoan

    /**
     *
     * @param newExhibition ein DTO einer neuen Exhibition
     * @return Response 200 <i>oder</i>
     *          Response 406 mit einer definierten Fehlermeldung
     */
    @POST
    @Transactional
    @Path("/new")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response postNewExhibition(AddExhibitionDTO newExhibition){
        Exhibition exhibition = new Exhibition();
        List<Exhibit> newExhibitList = new LinkedList<>();
        User user = userRepo.findById(newExhibition.getUser_id());
        Room room = roomRepo.findById(newExhibition.getRoom_id());
        if (user == null || room == null){
            return Response.status(406).build();
        }

        Set<Category> categories = new HashSet<>();
        for (Long i: newExhibition.getCategory_ids()) {
            Category temp = categoryRepo.findById(i);
            if(temp == null){
                return Response.status(406).build();
            } else {
                categories.add(temp);
            }
        }
        exhibition.user = user;
        exhibition.room = room;
        exhibition.categories = categories;
        exhibition.thumbnail_url = newExhibition.getThumbnail_url();
        exhibition.description = newExhibition.getDescription();
        exhibition.title = newExhibition.getTitle();

        // exhibits
        for(AddExhibitDTO i: newExhibition.getExhibits()){
            if(i != null){
                Theme theme = themeRepo.findById(i.getTheme_id());
                Position position = positionRepo.findById(i.getPosition_id());
                if ((theme == null) || (i.getAlignment().length() != 1) || (position == null)){        // weil alignment nur Länge von 1 hat
                    return Response.status(406).build();
                } else {
                    Exhibit newExhibit = new Exhibit(i.getUrl(), i.getData_type(), i.getTitle(), i.getDescription(), i.getScale(), i.getAlignment());
                    newExhibit.theme = theme;
                    newExhibit.position = position;
                    newExhibit.exhibition = exhibition;
                    newExhibitList.add(newExhibit);
                    //newExhibit.exhibition = exhibition;
                  //  exhibitRepo.persist(newExhibitList);
                }
            }
        }
        // hier werden die exhibits zuerst eingeschrieben bevor sie hinzugefügt werden
        if((long) newExhibitList.size() > 0){
             exhibitRepo.persist(newExhibitList);
             exhibition.exhibits = newExhibitList;
           // exhibitRepo.postExhibits(newExhibitList, exhibition);
        } else {
            return Response.status(406).entity("cannot post exhibition without exhibits").build();
        }
        exhibitionRepo.persist(exhibition);
        return Response.ok().build();
    }

    @DELETE
    @Transactional
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/deleteById/{exhibitionId}")
    public Response deleteExhibitionById(@PathParam("exhibitionId") Long id){
        Exhibition exhibition = exhibitionRepo.findById(id);
        if (exhibition == null){
            return Response.status(406).entity("no exhibition with this id").build();
        } else {
            for (Exhibit exhibit : exhibition.exhibits) {
                exhibitRepo.delete(exhibit);
            }
            exhibitionRepo.delete(exhibition);
            return Response.noContent().build();
        }
    }
}
