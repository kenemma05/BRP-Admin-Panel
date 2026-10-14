import React from 'react';
import { UserCategory, NeonUser } from '../../../types';
import { BioInnovatorDashboard } from './BioInnovatorDashboard';
import { ClinicalInvestigatorDashboard } from './ClinicalInvestigatorDashboard';
import { LifeSciencesPartnerDashboard } from './LifeSciencesPartnerDashboard';
import { ResearcherDashboard } from './ResearcherDashboard';
import { BusinessDevPartnerDashboard } from './BusinessDevPartnerDashboard';
import { AcademicPartnerDashboard } from './AcademicPartnerDashboard';
import { LifeSciencesCollaboratorDashboard } from './LifeSciencesCollaboratorDashboard';
import { AcademicLiaisonDashboard } from './AcademicLiaisonDashboard';
import { PrincipalInvestigatorDashboard } from './PrincipalInvestigatorDashboard';
import { ClinicalMedicalDashboard } from './ClinicalMedicalDashboard';
import { StrategicPartnerDashboard } from './StrategicPartnerDashboard';
import { CoDeveloperDashboard } from './CoDeveloperDashboard';
import { ConsortiumMemberDashboard } from './ConsortiumMemberDashboard';
import { TechTransferDashboard } from './TechTransferDashboard';

interface ClientRoleDashboardRouterProps {
  category: UserCategory;
  currentUser?: NeonUser | null;
}

export const ClientRoleDashboardRouter: React.FC<ClientRoleDashboardRouterProps> = ({
  category,
  currentUser,
}) => {
  switch (category) {
    case 'Bio-Innovator / Strategic Partner':
      return <BioInnovatorDashboard currentUser={currentUser} />;

    case 'Clinical Collaborator / Investigator':
      return <ClinicalInvestigatorDashboard currentUser={currentUser} />;

    case 'Life Sciences Partner':
      return <LifeSciencesPartnerDashboard currentUser={currentUser} />;

    case 'Researcher':
      return <ResearcherDashboard currentUser={currentUser} />;

    case 'Business Development (BD) Partner':
      return <BusinessDevPartnerDashboard currentUser={currentUser} />;

    case 'Academic Partner / Principal Investigator (PI)':
      return <AcademicPartnerDashboard currentUser={currentUser} />;

    case 'Life Sciences Collaborator / Partner':
      return <LifeSciencesCollaboratorDashboard currentUser={currentUser} />;

    case 'Academic/Industry Liaison (or Academic Innovator)':
      return <AcademicLiaisonDashboard currentUser={currentUser} />;

    case 'Principal Investigator':
      return <PrincipalInvestigatorDashboard currentUser={currentUser} />;

    case 'Clinical / Medical Collaborator':
      return <ClinicalMedicalDashboard currentUser={currentUser} />;

    case 'Strategic Partner':
      return <StrategicPartnerDashboard currentUser={currentUser} />;

    case 'Co-Developer':
      return <CoDeveloperDashboard currentUser={currentUser} />;

    case 'Industry Partner / Consortium Member':
      return <ConsortiumMemberDashboard currentUser={currentUser} />;

    case 'Technology Transfer Partner':
      return <TechTransferDashboard currentUser={currentUser} />;

    default:
      return <BioInnovatorDashboard currentUser={currentUser} />;
  }
};
