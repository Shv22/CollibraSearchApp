package org.nbc.gateway.model;

public class OwnerGroup
{
    private String createdOn;

    private String groupName;

    private String resourceId;

    private String lastModified;

    private CreatedBy createdBy;

    private LastModifiedBy lastModifiedBy;

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

    public String getGroupName ()
    {
        return groupName;
    }

    public void setGroupName (String groupName)
    {
        this.groupName = groupName;
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

    public LastModifiedBy getLastModifiedBy ()
    {
        return lastModifiedBy;
    }

    public void setLastModifiedBy (LastModifiedBy lastModifiedBy)
    {
        this.lastModifiedBy = lastModifiedBy;
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
        return "ClassPojo [createdOn = "+createdOn+", groupName = "+groupName+", resourceId = "+resourceId+", lastModified = "+lastModified+", createdBy = "+createdBy+", lastModifiedBy = "+lastModifiedBy+", locked = "+locked+", isSystem = "+isSystem+", resourceType = "+resourceType+"]";
    }
}
