const fetchUserData = async () => {
  setLoading(true);
  try {
    if (!supabase) {
      // Demo fallback
      const { MOCK_REQUESTS, MOCK_RESPONSES } = await import('@/lib/mockData');
      const userRequests = MOCK_REQUESTS.filter(r => r.authorId === userId);
      const userResponsesWithRequests = MOCK_RESPONSES
        .filter(r => r.authorId === userId)
        .map(resp => ({
          ...resp,
          request: MOCK_REQUESTS.find(req => req.id === resp.requestId),
        }));
      setUserRequests(userRequests);
      setUserResponses(userResponsesWithRequests as any);
      return;
    }

    // Параллельные запросы
    const [reqs, resps] = await Promise.all([
      supabase
        .from('requests')
        .select('*')
        .eq('authorId', userId)
        .order('createdAt', { ascending: false }),

      supabase
        .from('responses')
        .select('*, request:requests(*)')
        .eq('authorId', userId)
        .order('createdAt', { ascending: false }),
    ]);

    if (reqs.error) throw reqs.error;
    if (resps.error) throw resps.error;

    setUserRequests(reqs.data ?? []);
    setUserResponses(resps.data ?? []);
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    toast.error(error?.message ?? 'Failed to load profile data.');
  } finally {
    setLoading(false);
  }
};

const formatDate = (dateLike: any) => {
  const d = typeof dateLike === 'string' ? new Date(dateLike) : new Date(dateLike ?? Date.now());
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

    
 
                
      
                 
