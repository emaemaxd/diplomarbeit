package org.threeDPortfolioGallery.repos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.TypedQuery;
import org.threeDPortfolioGallery.workloads.Exhibition;
import org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

//TODO JAVADOC
@ApplicationScoped
public class ExhibitionRepo implements PanacheRepository<Exhibition> {

    public Exhibition getById(long id) {
        return findById(id);
    }

    public List<Exhibition> getAllExhibitionsForUser(long userid) {
        return list("user.id", userid);
    }

    /**
     * @param term keyword to check for
     * @return list of found exhibitions
     */
    public List<ExhibitionWithUserDTO> listAllBySearchTerm(String term) {
        String sql = "select DISTINCT new org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO(e, u.user_name, u.icon_url) from Exhibition e " +
                "join e.user u left join e.categories c " +
                "where lower(e.user.user_name) like :term or lower(e.title) like :term order by e.id desc";

        TypedQuery<ExhibitionWithUserDTO> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserDTO.class);
        q.setParameter("term", "%" + term.toLowerCase() + "%");

        return q.getResultList();
    }

    /**
     * Gibt die 5 zuletzt hinzugefügten Exhibitions zurück
     *
     * @return list of 5 exhibitions
     */
    public List<ExhibitionWithUserDTO> getLatestFive() {
        //String sql = "select new org.threeDPortfolioGallery.records.ExhibitionWithUserRecord(e, u.user_name, u.icon_url) from Exhibition e " +
          //      "join e.user u left join e.categories order by e.id desc";
        String sql = "select new org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO(e,u.user_name, u.icon_url) from Exhibition e " +
                "join e.user u left  join e.categories order by e.id desc";
        TypedQuery<ExhibitionWithUserDTO> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserDTO.class);
        q.setMaxResults(5);
        return q.getResultList();
    }

    /** Gibt alle Exhibitions zurück, unsortiert, ungefiltert.
     * @return alle Exhibitions in der DB
     */
    public List<ExhibitionWithUserDTO> listAllExhibitionsWithUserField() {

        String sql = "select new org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO(e, u.user_name, u.icon_url) from Exhibition e join e.user u left join e.categories c";

        TypedQuery<ExhibitionWithUserDTO> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserDTO.class);
        var ret = q.getResultList();
        return ret;
    }

    /**
     * @param id category id
     * @return eine Liste von ExhibitionWithUserRecord
     */
    public List<ExhibitionWithUserDTO> getByCategoryId(Long id) {
        String sql = "select new org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO(e, u.user_name, u.icon_url) " +
                "from Exhibition e join e.user u left join e.categories c where c.id in :categoryid";
        TypedQuery<ExhibitionWithUserDTO> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserDTO.class
                );
        q.setParameter("categoryid", id);
        return q.getResultList();
    }

    /**
     * alle exhibitions zu mehreren Category ids
     * @param ids Eine Liste von Category Ids
     * @return Alle gefundenen Exhibitions
     */
    public List<ExhibitionWithUserDTO> getByCategoryIds(List<Long> ids) {
        String sql = "select new org.threeDPortfolioGallery.workloads.dto.ExhibitionWithUserDTO(e, u.user_name, u.icon_url) " +
                "from Exhibition e join e.user u left join e.categories c where c.id in :categoryid";
        TypedQuery<ExhibitionWithUserDTO> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserDTO.class
                );
        q.setParameter("categoryid", ids.get(0));

        List<ExhibitionWithUserDTO> exhibitions = q.getResultList();
        List<Long> catIds = new LinkedList<>();

        var ret = new LinkedList<ExhibitionWithUserDTO>();
        for (var exhibition: exhibitions ) {
            if(exhibition.getExhibition().categories != null){
                catIds.clear();
                for (var cat: exhibition.getExhibition().categories) {
                    catIds.add(cat.id);
                }
                if(new HashSet<>(catIds).containsAll(ids)){ // statt catIds.containsAll(ids) wegen performance, ye
                    ret.add(exhibition);
                }
            }
        }
        return ret;
    }


    public Long addExhibition(Exhibition newExhibition) {
        getEntityManager().persist(newExhibition);
        getEntityManager().flush();
        return newExhibition.id ;
    }
}
