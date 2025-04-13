// Navigation items with icons for the sidebar and mobile navigation
export const navigationItems = [
  {
    path: "/",
    label: "Home",
    icon: "ri-home-6-line"
  },
  {
    path: "/discussions",
    label: "Discussions",
    icon: "ri-discuss-line"
  },
  {
    path: "/governance",
    label: "Governance",
    icon: "ri-government-line"
  },
  {
    path: "/rights-agreement",
    label: "Rights Agreement",
    icon: "ri-user-voice-line"
  },
  {
    path: "/community-needs",
    label: "Community Needs",
    icon: "ri-community-line"
  },
  {
    path: "/wellbeing",
    label: "Wellbeing",
    icon: "ri-heart-pulse-line"
  },
  {
    path: "/achievements",
    label: "Achievements",
    icon: "ri-award-line"
  },
  {
    path: "/moderation",
    label: "Moderation",
    icon: "ri-shield-check-line",
    adminOnly: true
  }
];

// Icons for the contribution stats
export const contributionIcons = {
  discussions: "ri-message-3-line",
  replies: "ri-reply-line",
  proposals: "ri-draft-line",
  reactions: "ri-thumb-up-line"
};

// Category icons for badge categorization
export const categoryIcons = {
  participation: "ri-discuss-line",
  social: "ri-heart-3-line",
  achievement: "ri-trophy-line",
  creation: "ri-lightbulb-line",
  community: "ri-team-line"
};

// Status icons for amendments
export const amendmentStatusIcons = {
  proposed: "ri-draft-line",
  approved: "ri-check-line",
  rejected: "ri-close-line"
};
