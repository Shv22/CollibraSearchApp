package org.nbc.gateway.model;

public class TypeReference {
	private String createdOn;

    private TailTerm tailTerm;

    private String resourceId;

    private HeadTerm headTerm;

    private String lastModified;

    private CreatedBy createdBy;

    private String coRole;

    private LastModifiedBy lastModifiedBy;

    private String role;

    private String locked;

    private String signifier;
    
    public String getSignifier() {
		return signifier;
	}

	public void setSignifier(String signifier) {
		this.signifier = signifier;
	}

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

    public TailTerm getTailTerm ()
    {
        return tailTerm;
    }

    public void setTailTerm (TailTerm tailTerm)
    {
        this.tailTerm = tailTerm;
    }

    public String getResourceId ()
    {
        return resourceId;
    }

    public void setResourceId (String resourceId)
    {
        this.resourceId = resourceId;
    }

    public HeadTerm getHeadTerm ()
    {
        return headTerm;
    }

    public void setHeadTerm (HeadTerm headTerm)
    {
        this.headTerm = headTerm;
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

    public String getCoRole ()
    {
        return coRole;
    }

    public void setCoRole (String coRole)
    {
        this.coRole = coRole;
    }

    public LastModifiedBy getLastModifiedBy ()
    {
        return lastModifiedBy;
    }

    public void setLastModifiedBy (LastModifiedBy lastModifiedBy)
    {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getRole ()
    {
        return role;
    }

    public void setRole (String role)
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
        return "ClassPojo [createdOn = "+createdOn+", tailTerm = "+tailTerm+", resourceId = "+resourceId+", headTerm = "+headTerm+", lastModified = "+lastModified+", createdBy = "+createdBy+", coRole = "+coRole+", lastModifiedBy = "+lastModifiedBy+", role = "+role+", locked = "+locked+", isSystem = "+isSystem+", resourceType = "+resourceType+"]";
    }
}
