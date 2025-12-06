import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useGetFeaturedJobs = () => {
    return useQuery(api.jobs.getFeatured);
};

export const useGetTopCompanies = () => {
    return useQuery(api.companies.getTop);
};

export const useGetJobs = () => {
    return useQuery(api.jobs.get, {});
};

export const useGetJob = (id: string) => {
    // @ts-ignore
    return useQuery(api.jobs.getById, { id });
};

export const useCreateJob = () => {
    return useMutation(api.jobs_mutations.create);
};

export const useUpdateJobStatus = () => {
    return useMutation(api.jobs_mutations.updateStatus);
};

export const useGetUser = () => {
    return useQuery(api.users.getUser);
};

export const useCreateUser = () => {
    return useMutation(api.users.createUser);
};

export const useUpdateResume = () => {
    return useMutation(api.users.updateResume);
};

export const useCreateCompany = () => {
    return useMutation(api.companies.create);
};

export const useUpdateCompanyStatus = () => {
    return useMutation(api.companies.updateStatus);
};
