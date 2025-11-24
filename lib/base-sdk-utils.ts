function withValidProperties(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      if (typeof value === 'string') return value.length > 0;
      return !!value;
    })
  );
}

export { withValidProperties };