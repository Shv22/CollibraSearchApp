package org.nbc.gateway.model;

public class Type
{
    private String id;

    private String val;

    private String pageUrl;

    private String restUrl;

    private String type;

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

    @Override
    public String toString()
    {
        return "ClassPojo [id = "+id+", val = "+val+", pageUrl = "+pageUrl+", restUrl = "+restUrl+", type = "+type+"]";
    }
}