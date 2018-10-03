package org.nbc.gateway.model;

public class TailTerm {
	private String createdOn;

    private String resourceId;

    private String lastModified;
    
    private String description;

    private CreatedBy createdBy;

    private VocabularyReference vocabularyReference;

    private LastModifiedBy lastModifiedBy;

    private String signifier;

    private String locked;

    private String isSystem;

    private String resourceType;

    public String getCreatedOn ()
    {
        return createdOn;
    }

    public void setCreatedOn (String createdOn)
    {
        this.createdOn = createdOn;
    }

    public String getResourceId ()
    {
        return resourceId;
    }

    public void setResourceId (String resourceId)
    {
        this.resourceId = resourceId;
    }

    public String getLastModified ()
    {
        return lastModified;
    }

    public void setLastModified (String lastModified)
    {
        this.lastModified = lastModified;
    }

    public CreatedBy getCreatedBy ()
    {
        return createdBy;
    }

    public void setCreatedBy (CreatedBy createdBy)
    {
        this.createdBy = createdBy;
    }

    public VocabularyReference getVocabularyReference ()
    {
        return vocabularyReference;
    }

    public void setVocabularyReference (VocabularyReference vocabularyReference)
    {
        this.vocabularyReference = vocabularyReference;
    }

    public LastModifiedBy getLastModifiedBy ()
    {
        return lastModifiedBy;
    }

    public void setLastModifiedBy (LastModifiedBy lastModifiedBy)
    {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getSignifier ()
    {
        return signifier;
    }

    public void setSignifier (String signifier)
    {
        this.signifier = signifier;
    }

    public String getLocked ()
    {
        return locked;
    }

    public void setLocked (String locked)
    {
        this.locked = locked;
    }

    public String getIsSystem ()
    {
        return isSystem;
    }

    public void setIsSystem (String isSystem)
    {
        this.isSystem = isSystem;
    }

    public String getResourceType ()
    {
        return resourceType;
    }

    public void setResourceType (String resourceType)
    {
        this.resourceType = resourceType;
    }
    
    public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
    

    @Override
    public String toString()
    {
        return "ClassPojo [createdOn = "+createdOn+", resourceId = "+resourceId+", lastModified = "+lastModified+", createdBy = "+createdBy+", vocabularyReference = "+vocabularyReference+", lastModifiedBy = "+lastModifiedBy+", signifier = "+signifier+", locked = "+locked+", isSystem = "+isSystem+", resourceType = "+resourceType+"]";
    }
}
