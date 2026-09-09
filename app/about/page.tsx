export const metadata = {
  title: "about",
};

export default function Page() {
  return (
    <section className="document-padding flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="retro-display font-serif">
        about <span className="italic text-primary">me</span>
      </h1>
      <p className="max-w-xl text-muted-foreground">this page is still under construction — check back soon!</p>
    </section>
  );
}
