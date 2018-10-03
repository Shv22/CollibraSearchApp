package org.nbc.gateway.model;

public class Role
{
    private String createdOn;

    private String resourceId;

    private String lastModified;

    private CreatedBy createdBy;

    private String global;

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

    public String getGlobal ()
    {
        return global;
    }

    public void setGlobal (String global)
    {
        this.global = global;
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

    @Override
    public String toString()
    {
        return "ClassPojo [createdOn = "+createdOn+", resourceId = "+resourceId+", lastModified = "+lastModified+", createdBy = "+createdBy+", global = "+global+", lastModifiedBy = "+lastModifiedBy+", signifier = "+signifier+", locked = "+locked+", isSystem = "+isSystem+", resourceType = "+resourceType+"]";
    }
}
	
