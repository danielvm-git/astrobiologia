export default defineEventHandler((event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  return {
    user: {
      id: user.$id,
      email: user.email,
      name: user.name,
      labels: user.labels,
    },
  };
});
