package org.nbc.gateway.model;

import java.util.List;

public class Results
{
	private List<Relation[]> relations;
	
    private String[] parents;

	public List<Relation[]> getRelation() {
		return relations;
	}

	public void setRelation(List<Relation[]> relation) {
		this.relations = relations;
	}

	private String status;

    private Name name;

    private String score;

    private Context context;

    private Attributes[] attributes;

    private Type type;

    private String[] comments;

    private String modified;

    public String[] getParents ()
    {
        return parents;
    }

    public void setParents (String[] parents)
    {
        this.parents = parents;
    }

    public String getStatus ()
    {
        return status;
    }

    public void setStatus (String status)
    {
        this.status = status;
    }

    public Name getName ()
    {
        return name;
    }

    public void setName (Name name)
    {
        this.name = name;
    }

    public String getScore ()
    {
        return score;
    }

    public void setScore (String score)
    {
        this.score = score;
    }

    public Context getContext ()
    {
        return context;
    }

    public void setContext (Context context)
    {
        this.context = context;
    }

    public Attributes[] getAttributes ()
    {
        return attributes;
    }

    public void setAttributes (Attributes[] attributes)
    {
        this.attributes = attributes;
    }

    public Type getType ()
    {
        return type;
    }

    public void setType (Type type)
    {
        this.type = type;
    }

    public String[] getComments ()
    {
        return comments;
    }

    public void setComments (String[] comments)
    {
        this.comments = comments;
    }

    public String getModified ()
    {
        return modified;
    }

    public void setModified (String modified)
    {
        this.modified = modified;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [parents = "+parents+", status = "+status+", name = "+name+", score = "+score+", context = "+context+", attributes = "+attributes+", type = "+type+", comments = "+comments+", modified = "+modified+"]";
    }
}