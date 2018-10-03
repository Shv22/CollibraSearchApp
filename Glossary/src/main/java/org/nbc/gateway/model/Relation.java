package org.nbc.gateway.model;

public class Relation {
	private String createdOn;

    private String resourceId;

    private String lastModified;

    private TargetReference targetReference;

    private CreatedBy createdBy;

    private SourceReference sourceReference;

    private TypeReference typeReference;

    private LastModifiedBy lastModifiedBy;

    private String locked;

    private String isSystem;

    private StatusReference statusReference;

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

    public TargetReference getTargetReference ()
    {
        return targetReference;
    }

    public void setTargetReference (TargetReference targetReference)
    {
        this.targetReference = targetReference;
    }

    public CreatedBy getCreatedBy ()
    {
        return createdBy;
    }

    public void setCreatedBy (CreatedBy createdBy)
    {
        this.createdBy = createdBy;
    }

    public SourceReference getSourceReference ()
    {
        return sourceReference;
    }

    public void setSourceReference (SourceReference sourceReference)
    {
        this.sourceReference = sourceReference;
    }

    public TypeReference getTypeReference ()
    {
        return typeReference;
    }

    public void setTypeReference (TypeReference typeReference)
    {
        this.typeReference = typeReference;
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

    public StatusReference getStatusReference ()
    {
        return statusReference;
    }

    public void setStatusReference (StatusReference statusReference)
    {
        this.statusReference = statusReference;
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
        return "ClassPojo [createdOn = "+createdOn+", resourceId = "+resourceId+", lastModified = "+lastModified+", targetReference = "+targetReference+", createdBy = "+createdBy+", sourceReference = "+sourceReference+", typeReference = "+typeReference+", lastModifiedBy = "+lastModifiedBy+", locked = "+locked+", isSystem = "+isSystem+", statusReference = "+statusReference+", resourceType = "+resourceType+"]";
    }
}

