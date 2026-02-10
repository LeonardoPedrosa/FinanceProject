# Backend/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["FinanceApp.Api/FinanceApp.Api.csproj", "FinanceApp.Api/"]
RUN dotnet restore "FinanceApp.Api/FinanceApp.Api.csproj"
COPY . .
WORKDIR "/src/FinanceApp.Api"
RUN dotnet build "FinanceApp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FinanceApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Install EF Core tools for migrations
RUN dotnet tool install --global dotnet-ef --version 8.0.0
ENV PATH="${PATH}:/root/.dotnet/tools"

ENTRYPOINT ["dotnet", "FinanceApp.Api.dll"]
