package org.nbc.gateway.model;

public class MemberReference
{
    private String createdOn;

    private String resourceId;

    private String lastModified;

    private CreatedBy createdBy;

    private String associatedResourceType;

    private String ownerId;

    private LastModifiedBy lastModifiedBy;

    private String resource;

    private Role role;

    private String locked;

    public OwnerGroup getOwnerGroup() {
		return ownerGroup;
	}

	public void setOwnerGroup(OwnerGroup ownerGroup) {
		this.ownerGroup = ownerGroup;
	}

	private OwnerUser ownerUser;
    
    private OwnerGroup ownerGroup;

    private String group;

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

    public String getAssociatedResourceType ()
    {
        return associatedResourceType;
    }

    public void setAssociatedResourceType (String associatedResourceType)
    {
        this.associatedResourceType = associatedResourceType;
    }

    public String getOwnerId ()
    {
        return ownerId;
    }

    public void setOwnerId (String ownerId)
    {
        this.ownerId = ownerId;
    }

    public LastModifiedBy getLastModifiedBy ()
    {
        return lastModifiedBy;
    }

    public void setLastModifiedBy (LastModifiedBy lastModifiedBy)
    {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getResource ()
    {
        return resource;
    }

    public void setResource (String resource)
    {
        this.resource = resource;
    }

    public Role getRole ()
    {
        return role;
    }

    public void setRole (Role role)
    {
        this.role = role;
    }

    public String getLocked ()
    {
        return locked;
    }

    public void setLocked (String locked)
    {
        this.locked = locked;
    }

    public OwnerUser getOwnerUser ()
    {
        return ownerUser;
    }

    public void setOwnerUser (OwnerUser ownerUser)
    {
        this.ownerUser = ownerUser;
    }

    public String getGroup ()
    {
        return group;
    }

    public void setGroup (String group)
    {
        this.group = group;
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
        return "ClassPojo [createdOn = "+createdOn+", resourceId = "+resourceId+", lastModified = "+lastModified+", createdBy = "+createdBy+", associatedResourceType = "+associatedResourceType+", ownerId = "+ownerId+", lastModifiedBy = "+lastModifiedBy+", resource = "+resource+", role = "+role+", locked = "+locked+", ownerUser = "+ownerUser+", group = "+group+", isSystem = "+isSystem+", resourceType = "+resourceType+"]";
    }
}
	
