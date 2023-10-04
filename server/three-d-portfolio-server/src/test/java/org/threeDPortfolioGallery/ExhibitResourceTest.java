package org.threeDPortfolioGallery;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.threeDPortfolioGallery.repos.ExhibitRepo;
import org.threeDPortfolioGallery.resource.ExhibitResource;
import org.threeDPortfolioGallery.workloads.Exhibit;

import static io.restassured.RestAssured.given;

@QuarkusTest
@TestHTTPEndpoint(ExhibitResource.class)
public class ExhibitResourceTest {
    @InjectMock
    ExhibitRepo exhibitRepo;

    @Test
    public void testGetExhibitByCorrectId() {
        Exhibit mockExhibit = new Exhibit();
        mockExhibit.id = 1L;
        mockExhibit.title = "Test";
        Mockito.when(exhibitRepo.findById(mockExhibit.id)).thenReturn(mockExhibit);
    }

    @Test
    public void testGetExhibitByIncorrectId() {
        given()
                .when()
                .pathParam("exhibitId", 1L)
                .get("/api/exhibits/{exhibitId}")
                .then()
                .statusCode(404);
    }
}