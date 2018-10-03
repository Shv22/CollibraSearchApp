package org.nbc.gateway.model;

import java.util.List;

public class SearchResults {
	
	 private String total;

	    private Results[] results;

	    public String getTotal ()
	    {
	        return total;
	    }

	    public void setTotal (String total)
	    {
	        this.total = total;
	    }

	    public Results[] getResults ()
	    {
	        return results;
	    }

	    public void setResults (Results[] results)
	    {
	        this.results = results;
	    }

	    @Override
	    public String toString()
	    {
	        return "ClassPojo [total = "+total+", results = "+results+"]";
	    }
	

}
