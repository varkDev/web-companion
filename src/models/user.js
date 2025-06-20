const createEmptyUser = () => ({
  username: '',
  full_name: '',
  email: '',
  password: '',
  description: '',
  profile_picture: '',
  location: '',
  website: '',
  social_links: {
    twitter: '',
    github: '',
    linkedin: '',
  },
  date_created: new Date().toISOString(),
  reset_token: '',
});

export default createEmptyUser;
