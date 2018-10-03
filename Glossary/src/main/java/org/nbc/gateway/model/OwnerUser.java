package org.nbc.gateway.model;

public class OwnerUser
{
    private String enabled;

    private String lastName;

    private String ldapUser;

    private String lastModified;

    private String emailAddress;

    private String isSystem;

    private String resourceType;

    private String createdOn;

    private String apiUser;

    private String resourceId;

    private String activated;

    private String userName;

    private String gender;

    private String language;

    private String locked;

    private String firstName;

    public String getEnabled ()
    {
        return enabled;
    }

    public void setEnabled (String enabled)
    {
        this.enabled = enabled;
    }

    public String getLastName ()
    {
        return lastName;
    }

    public void setLastName (String lastName)
    {
        this.lastName = lastName;
    }

    public String getLdapUser ()
    {
        return ldapUser;
    }

    public void setLdapUser (String ldapUser)
    {
        this.ldapUser = ldapUser;
    }

    public String getLastModified ()
    {
        return lastModified;
    }

    public void setLastModified (String lastModified)
    {
        this.lastModified = lastModified;
    }

    public String getEmailAddress ()
    {
        return emailAddress;
    }

    public void setEmailAddress (String emailAddress)
    {
        this.emailAddress = emailAddress;
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

    public String getCreatedOn ()
    {
        return createdOn;
    }

    public void setCreatedOn (String createdOn)
    {
        this.createdOn = createdOn;
    }

    public String getApiUser ()
    {
        return apiUser;
    }

    public void setApiUser (String apiUser)
    {
        this.apiUser = apiUser;
    }

    public String getResourceId ()
    {
        return resourceId;
    }

    public void setResourceId (String resourceId)
    {
        this.resourceId = resourceId;
    }

    public String getActivated ()
    {
        return activated;
    }

    public void setActivated (String activated)
    {
        this.activated = activated;
    }

    public String getUserName ()
    {
        return userName;
    }

    public void setUserName (String userName)
    {
        this.userName = userName;
    }

    public String getGender ()
    {
        return gender;
    }

    public void setGender (String gender)
    {
        this.gender = gender;
    }

    public String getLanguage ()
    {
        return language;
    }

    public void setLanguage (String language)
    {
        this.language = language;
    }

    public String getLocked ()
    {
        return locked;
    }

    public void setLocked (String locked)
    {
        this.locked = locked;
    }

    public String getFirstName ()
    {
        return firstName;
    }

    public void setFirstName (String firstName)
    {
        this.firstName = firstName;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [enabled = "+enabled+", lastName = "+lastName+", ldapUser = "+ldapUser+", lastModified = "+lastModified+", emailAddress = "+emailAddress+", isSystem = "+isSystem+", resourceType = "+resourceType+", createdOn = "+createdOn+", apiUser = "+apiUser+", resourceId = "+resourceId+", activated = "+activated+", userName = "+userName+", gender = "+gender+", language = "+language+", locked = "+locked+", firstName = "+firstName+"]";
    }
}