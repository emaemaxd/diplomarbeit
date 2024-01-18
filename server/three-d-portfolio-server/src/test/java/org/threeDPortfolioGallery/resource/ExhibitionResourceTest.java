package org.threeDPortfolioGallery.resource;

import io.quarkus.test.InjectMock;
import io.quarkus.test.Mock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.common.http.TestHTTPResource;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.threeDPortfolioGallery.repos.ExhibitionRepo;
import org.threeDPortfolioGallery.workloads.Exhibit;
import org.threeDPortfolioGallery.workloads.Exhibition;

import java.util.ArrayList;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

@QuarkusTest
@TestHTTPEndpoint(ExhibitionResource.class)
class ExhibitionResourceTest {

    @InjectMock
    ExhibitionRepo exhibitionRepo;

    @Test
    void downloadFile() {
    }

    @Test
    void downloadImageFile() {
    }

    @Test
    void uploadFile() {
    }

    @Test
    void getExhibitionByIdCorrect() {
        Exhibition mock = new Exhibition();
        mock.id = 1L;
        mock.title = "Test";
        Mockito.when(exhibitionRepo.findById(mock.id)).thenReturn(mock);
    }

    @Test
    void getExhibitionByIdNotFound() {
        given()
                .when()
                .pathParam("exhibitionId", 1L)
                .get("/api/exhibitions/{exhibitionId}")
                .then()
                .statusCode(404);
    }

    @Test
    void getExhibitionsByUser() {
        List<Exhibition> mock = new ArrayList<Exhibition>();
        mock.add(new Exhibition());
        Mockito.when(exhibitionRepo.getAllExhibitionsForUser(1L)).thenReturn(mock);
    }

    @Test
    void getAllExhibitions() {
        List<Exhibition> mock = new ArrayList<Exhibition>();
        mock.add(new Exhibition());
        Mockito.when(exhibitionRepo.listAll()).thenReturn(mock);
    }

    @Test
    void getExhibitionsBySearchTerm() {

    }

    @Test
    void getLastFiveExhibitions() {
    }

    @Test
    void getExhibitionByCategory() {
    }

    @Test
    void getExhibitionsByCategories() {
    }

    @Test
    void postNewExhibition() {
    }

    @Test
    void deleteExhibitionById() {
        exhibitionRepo.deleteById(1L);
        verify(exhibitionRepo).deleteById(1L);
    }
}