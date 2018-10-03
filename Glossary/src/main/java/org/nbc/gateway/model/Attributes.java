package org.nbc.gateway.model;

public class Attributes
{
    private String id;

    private String val;

    private String pageUrl;

    private String restUrl;

    private String type;

    private String typeId;

    public String getId ()
    {
        return id;
    }

    public void setId (String id)
    {
        this.id = id;
    }

    public String getVal ()
    {
        return val;
    }

    public void setVal (String val)
    {
        this.val = val;
    }

    public String getPageUrl ()
    {
        return pageUrl;
    }

    public void setPageUrl (String pageUrl)
    {
        this.pageUrl = pageUrl;
    }

    public String getRestUrl ()
    {
        return restUrl;
    }

    public void setRestUrl (String restUrl)
    {
        this.restUrl = restUrl;
    }

    public String getType ()
    {
        return type;
    }

    public void setType (String type)
    {
        this.type = type;
    }

    public String getTypeId ()
    {
        return typeId;
    }

    public void setTypeId (String typeId)
    {
        this.typeId = typeId;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [id = "+id+", val = "+val+", pageUrl = "+pageUrl+", restUrl = "+restUrl+", type = "+type+", typeId = "+typeId+"]";
    }
}
	
