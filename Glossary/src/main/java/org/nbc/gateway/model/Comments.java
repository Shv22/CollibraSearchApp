package org.nbc.gateway.model;

public class Comments {
	private Comment[] comment;

    private String size;

    public Comment[] getComment ()
    {
        return comment;
    }

    public void setComment (Comment[] comment)
    {
        this.comment = comment;
    }

    public String getSize ()
    {
        return size;
    }

    public void setSize (String size)
    {
        this.size = size;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [comment = "+comment+", size = "+size+"]";
    }
}
