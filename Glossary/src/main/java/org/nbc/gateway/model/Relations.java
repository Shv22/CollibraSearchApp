package org.nbc.gateway.model;

public class Relations
{
    private Relation[] relation;

    public Relation[] getRelation ()
    {
        return relation;
    }

    public void setRelation (Relation[] relation)
    {
        this.relation = relation;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [relation = "+relation+"]";
    }
}
	
