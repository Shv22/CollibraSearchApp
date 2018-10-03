package org.nbc.gateway.model;

public class Members {
	private MemberReference[] memberReference;

    public MemberReference[] getMemberReference ()
    {
        return memberReference;
    }

    public void setMemberReference (MemberReference[] memberReference)
    {
        this.memberReference = memberReference;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [memberReference = "+memberReference+"]";
    }
}
