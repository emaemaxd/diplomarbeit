package org.threeDPortfolioGallery.repos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.persistence.TypedQuery;
import org.hibernate.Session;
import org.threeDPortfolioGallery.records.ExhibitionWithUserRecord;
import org.threeDPortfolioGallery.workloads.Category;
import org.threeDPortfolioGallery.workloads.Exhibition;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;
import java.util.stream.Collectors;

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
    public List<ExhibitionWithUserRecord> listAllBySearchTerm(String term) {
        String sql = "select DISTINCT new org.threeDPortfolioGallery.records.ExhibitionWithUserRecord(e, u.user_name, u.icon_url) from Exhibition e " +
                "join e.user u left join e.categories c " +
                "where lower(e.user.user_name) like :term or lower(e.title) like :term order by e.id desc";

        TypedQuery<ExhibitionWithUserRecord> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserRecord.class);
        q.setParameter("term", "%" + term.toLowerCase() + "%");

        return q.getResultList();
    }

    /**
     * Gibt die 5 zuletzt hinzugefügten Exhibitions zurück
     *
     * @return list of 5 exhibitions
     */
    public List<ExhibitionWithUserRecord> getLatestFive() {
        String sql = "select new org.threeDPortfolioGallery.records.ExhibitionWithUserRecord(e, u.user_name, u.icon_url) from Exhibition e " +
                "join e.user u left join e.categories order by e.id desc";

        TypedQuery<ExhibitionWithUserRecord> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserRecord.class);
        q.setMaxResults(5);
        return q.getResultList();
    }

    /**
     * @return alle Exhibitions in der DB
     */
    public List<ExhibitionWithUserRecord> listAllExhibitionsWithUserField() {

        String sql = "select new org.threeDPortfolioGallery.records.ExhibitionWithUserRecord(e, u.user_name, u.icon_url) from Exhibition e join e.user u left join e.categories c";

        TypedQuery<ExhibitionWithUserRecord> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserRecord.class);
        var ret = q.getResultList();
        return ret;
    }

    /**
     * @param id category id
     * @return eine Liste von ExhibitionWithUserRecord
     */
    public List<ExhibitionWithUserRecord> getByCategoryId(Long id) {
        String sql = "select new org.threeDPortfolioGallery.records.ExhibitionWithUserRecord(e, u.user_name, u.icon_url) " +
                "from Exhibition e join e.user u left join e.categories c where c.id in :categoryid";
        TypedQuery<ExhibitionWithUserRecord> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserRecord.class
                );
        q.setParameter("categoryid", id);
        return q.getResultList();
    }

    /**
     * alle exhibitions zu mehreren Category ids
     * @param ids Eine Liste von Category Ids
     * @return Alle gefundenen Exhibitions
     */
    public List<ExhibitionWithUserRecord> getByCategoryIds(List<Long> ids) {
        String sql = "select new org.threeDPortfolioGallery.records.ExhibitionWithUserRecord(e, u.user_name, u.icon_url) " +
                "from Exhibition e join e.user u left join e.categories c where c.id in :categoryid";
        TypedQuery<ExhibitionWithUserRecord> q = getEntityManager()
                .createQuery(sql
                        , ExhibitionWithUserRecord.class
                );
        q.setParameter("categoryid", ids.get(0));

        List<ExhibitionWithUserRecord> exhibitions = q.getResultList();
        List<Long> catIds = new LinkedList<>();

        var ret = new LinkedList<ExhibitionWithUserRecord>();
        for (var exhibition: exhibitions ) {
            if(exhibition.exhibition().categories != null){
                catIds.clear();
                for (var cat: exhibition.exhibition().categories) {
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
