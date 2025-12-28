# Application Methodologies & Flows

## Recruiter Flow Explanation

The Recruiter workflow is designed to be streamlined, guiding the user from account creation to successfully hiring a candidate.

1.  **Authentication & Onboarding**:
    *   **Sign Up/In**: Recruiters access the platform via a dedicated portal (`/auth/recruiter`).
    *   **Onboarding**: New recruiters *must* complete an onboarding flow where they provide Company Details (Name, Size, Logo) and select a Subscription Plan (Free tier for prototype).
    *   **Company Linking**: If the recruiter's email matches an existing company domain or invitation, they are linked; otherwise, a new Company profile is created.

2.  **Dashboard Access**:
    *   Once onboarded, they land on the **Recruiter Dashboard**.
    *   This central hub provides quick access to "Post a Job", "Post an Internship", and view recent variations.

3.  **Posting Opportunities**:
    *   **Jobs**: Recruiters can create detailed job postings with salary, location, and requirements.
    *   **Internships**: Dedicated flow for internships including stipend and duration details.
    *   **Status**: Posts can be saved as Drafts or published directly to "Active" status.

4.  **Candidate Management**:
    *   **Overview**: The "Candidates" page (`/recruiter/candidates`) displays a grid of all active postings with real-time applicant counts.
    *   **Scoped Review**: Clicking "View Applicants" on a specific job card opens a dedicated list (`/recruiter/candidates/[jobId]`) containing only applicants for *that* role.
    *   **Screening**: Recruiters can view candidate profiles (Resume, Experience) in a side-sheet without leaving the list.
    *   **Action**: Candidates can be marked as **Shortlisted** or **Rejected**. Shortlisting triggers an immediate in-app notification to the candidate.

---

## Application Flowchart

```mermaid
graph TD
    %% Entry Points
    User([User Visits Platform]) --> Navbar
    Navbar -->|Login/Signup| AuthSelection{Select Role}
    
    %% Authentication
    AuthSelection -->|Job Seeker| AuthJS[Job Seeker Auth]
    AuthSelection -->|Recruiter| AuthRec[Recruiter Auth]
    AuthSelection -->|Admin| AuthAdmin[Admin Auth]

    %% Job Seeker Flow
    AuthJS -->|Success| CheckProfile{Profile Complete?}
    CheckProfile -->|No| EditProfile[Edit Profile Page]
    CheckProfile -->|Yes| JSDashboard[Home / Jobs Feed]
    
    JSDashboard --> Search[Global Search / FilterBar]
    Search -->|View Job| JobDetails[Job Details Page]
    JobDetails -->|Apply| Application[Submit Application]
    Application --> Status[My Applications Status]
    
    %% Recruiter Flow
    AuthRec -->|Success| CheckOnboarding{Onboarding Complete?}
    CheckOnboarding -->|No| OnboardingFlow[Company Details & Plan]
    CheckOnboarding -->|Yes| RecDashboard[Recruiter Dashboard]
    
    RecDashboard --> PostJob[Post Job / Internship]
    RecDashboard --> ManageJobs[My Jobs List]
    
    ManageJobs -->|View Applicants| Candidates[Candidate List]
    Candidates -->|Review| ProfileSheet[Candidate Profile]
    ProfileSheet -->|Action| Shortlist[Shortlist / Reject]
    Shortlist -->|Trigger| Notification((Notify Candidate))
    
    %% Admin Flow
    AuthAdmin -->|Success| AdminDashboard[Admin Dashboard]
    AdminDashboard --> ManageCompanies[Company Management]
    AdminDashboard --> ManagePostings[Job/Internship Monitor]
    
    ManageCompanies -->|Select| CompanyProfile[Company Profile View]
    ManagePostings -->|Action| Moderation[Approve / Close Postings]

    %% Styling
    classDef primary fill:#f9f,stroke:#333,stroke-width:2px;
    classDef secondary fill:#bbf,stroke:#333,stroke-width:1px;
    class AuthSelection,RecDashboard,JSDashboard,AdminDashboard primary;
```
