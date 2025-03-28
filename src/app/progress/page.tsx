function Progress() {
  return (
    <iframe
      src={process.env.NEXT_PUBLIC_NOTION_JOURNAL_URL}
      width="100%"
      height="100%"
      className="h-screen"
    />
  );
}

export default Progress;
