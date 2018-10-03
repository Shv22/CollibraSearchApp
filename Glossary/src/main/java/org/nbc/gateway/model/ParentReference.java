package org.nbc.gateway.model;

public class ParentReference {
	private String lastModified;

    private String uri;

    private String isSystem;

    private String meta;

    private String resourceType;

    private String createdOn;

    private String resourceId;

    private CreatedBy createdBy;

    private String name;

    private LastModifiedBy lastModifiedBy;

    private String sbvr;

    private String language;

    private String locked;

    public String getLastModified ()
    {
        return lastModified;
    }

    public void setLastModified (String lastModified)
    {
        this.lastModified = lastModified;
    }

    public String getUri ()
    {
        return uri;
    }

    public void setUri (String uri)
    {
        this.uri = uri;
    }

    public String getIsSystem ()
    {
        return isSystem;
    }

    public void setIsSystem (String isSystem)
    {
        this.isSystem = isSystem;
    }

    public String getMeta ()
    {
        return meta;
    }

    public void setMeta (String meta)
    {
        this.meta = meta;
    }

    public String getResourceType ()
    {
        return resourceType;
    }

    public void setResourceType (String resourceType)
    {
        this.resourceType = resourceType;
    }

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

    public CreatedBy getCreatedBy ()
    {
        return createdBy;
    }

    public void setCreatedBy (CreatedBy createdBy)
    {
        this.createdBy = createdBy;
    }

    public String getName ()
    {
        return name;
    }

    public void setName (String name)
    {
        this.name = name;
    }

    public LastModifiedBy getLastModifiedBy ()
    {
        return lastModifiedBy;
    }

    public void setLastModifiedBy (LastModifiedBy lastModifiedBy)
    {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getSbvr ()
    {
        return sbvr;
    }

    public void setSbvr (String sbvr)
    {
        this.sbvr = sbvr;
    }

    public String getLanguage ()
    {
        return language;
    }

    public void setLanguage (String language)
    {
        this.language = language;
    }

    public String getLocked ()
    {
        return locked;
    }

    public void setLocked (String locked)
    {
        this.locked = locked;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [lastModified = "+lastModified+", uri = "+uri+", isSystem = "+isSystem+", meta = "+meta+", resourceType = "+resourceType+", createdOn = "+createdOn+", resourceId = "+resourceId+", createdBy = "+createdBy+", name = "+name+", lastModifiedBy = "+lastModifiedBy+", sbvr = "+sbvr+", language = "+language+", locked = "+locked+"]";
    }
}
