import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, BookOpen, CheckCircle2, Clock, Target, TrendingUp, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from "lucide-react";
import { weeksData, DailyTask, WeekData } from "@/data/weeksData";

/**
 * Design: Sistema de Domínio em Teologia Cristã
 * - Tema: Light (padrão) com suporte a Dark Mode
 * - Paleta: Azul primário (confiança, sabedoria) com acentos em cores por área
 * - Tipografia: Sem Serif para corpo, Bold para títulos
 * - Layout: Dashboard com abas para organização clara
 */

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"Todos" | "Leitura" | "Vídeo">("Todos");
  const [tasks, setTasks] = useState<{ [key: number]: DailyTask[] }>({});
  const [feedback, setFeedback] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [completedDays, setCompletedDays] = useState(0);

  // Função para limpar os filtros
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("Todos");
  };
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Dados da semana atual
  const weekData = weeksData.find((w) => w.week === currentWeek);
  const currentTasks = tasks[currentWeek] || weekData?.tasks || [];

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("teologia_tasks_all");
    const savedFeedback = localStorage.getItem("teologia_feedback");
    const savedWeeklyGoal = localStorage.getItem("teologia_weekly_goal");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Inicializar com dados padrão
      const initialTasks: { [key: number]: DailyTask[] } = {};
      weeksData.forEach((week) => {
        initialTasks[week.week] = week.tasks;
      });
      setTasks(initialTasks);
    }

    if (savedFeedback) setFeedback(savedFeedback);
    if (savedWeeklyGoal) setWeeklyGoal(savedWeeklyGoal);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem("teologia_tasks_all", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("teologia_feedback", feedback);
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem("teologia_weekly_goal", weeklyGoal);
  }, [weeklyGoal]);

  // Calcular dias completos da semana atual
  useEffect(() => {
    const completed = currentTasks.filter((t) => t.study && t.practice && t.test && t.review && t.devotional).length;
    setCompletedDays(completed);
  }, [currentTasks]);

  // Atualizar tarefa
  const updateTask = (id: string, field: keyof DailyTask, value: boolean) => {
    setTasks({
      ...tasks,
      [currentWeek]: currentTasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    });
  };

  // Calcular progresso geral
  const totalCheckboxes = currentTasks.length * 5;
  const checkedCheckboxes = currentTasks.filter((t) => t.study || t.practice || t.test || t.review || t.devotional).length * 5;
  const generalProgress = (checkedCheckboxes / totalCheckboxes) * 100;

  // Filtrar recursos
  const filteredResources = useMemo(() => {
    if (!weekData?.additionalResources) return [];

    return weekData.additionalResources.filter((resource) => {
      // Filtrar por tipo
      const typeMatch = filterType === "Todos" || resource.type === filterType;

      // Filtrar por termo de busca (título)
      const searchMatch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [weekData, searchTerm, filterType]);

  // Calcular progresso geral de todas as semanas
  const allTotalCheckboxes = Object.values(tasks).reduce((sum, weekTasks) => sum + weekTasks.length * 5, 0);
  const allCheckedCheckboxes = Object.values(tasks).reduce((sum, weekTasks) => {
    return sum + weekTasks.filter((t) => t.study || t.practice || t.test || t.review || t.devotional).length * 5;
  }, 0);
  const overallProgress = (allCheckedCheckboxes / allTotalCheckboxes) * 100;

  // Navegar para semana anterior/próxima
  const goToPreviousWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1);
  };

  const goToNextWeek = () => {
    if (currentWeek < 32) setCurrentWeek(currentWeek + 1);
  };

  // Obter cor da fase
  const getPhaseColor = (phase: number) => {
    const colors = ["bg-blue-100 text-blue-800", "bg-purple-100 text-purple-800", "bg-green-100 text-green-800", "bg-orange-100 text-orange-800"];
    return colors[phase - 1] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Sistema de Domínio em Teologia Cristã
              </h1>
            </div>
          <p className="text-slate-600 dark:text-slate-300">
            Seu caminho estruturado do nível Iniciante ao Acadêmico em 32 semanas
          </p>
          <div className="mt-4">
            <Link href="/study-materials">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Materiais de Estudo
              </Button>
            </Link>
          </div>
        </div>

        {/* Seletor de Semana */}
        <Card className="mb-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Navegação de Semanas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button onClick={goToPreviousWeek} disabled={currentWeek === 1} variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex-1">
                <Select value={currentWeek.toString()} onValueChange={(value) => setCurrentWeek(parseInt(value))}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-700">
                    {weeksData.map((week) => (
                      <SelectItem key={week.week} value={week.week.toString()}>
                        Semana {week.week} - {week.subArea} (Fase {week.phase})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={goToNextWeek} disabled={currentWeek === 32} variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {weekData && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Macroárea</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{weekData.macroArea}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Subárea</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{weekData.subArea}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Fase</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor(weekData.phase)}`}>
                      Fase {weekData.phase}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong>Objetivo:</strong> {weekData.objective}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progresso Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Progresso Geral (Todas as Semanas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.round(overallProgress)}%
              </div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {allCheckedCheckboxes} de {allTotalCheckboxes} tarefas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Progresso da Semana {currentWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.round(generalProgress)}%
              </div>
              <Progress value={generalProgress} className="h-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {checkedCheckboxes} de {totalCheckboxes} tarefas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Dias Completos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {completedDays}/7
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semana {currentWeek}
              </p>
            </CardContent>
          </Card>

<Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Prazo Total de Estudo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                32 Semanas
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                (Aproximadamente 8 meses)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principais */}
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
            <TabsTrigger value="checklist" className="text-xs md:text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs md:text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs md:text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Cronograma Diário</span>
            </TabsTrigger>
            <TabsTrigger value="recursos" className="text-xs md:text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Recursos</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-xs md:text-sm">
              <Target className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Metas</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs md:text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba: Checklist Diário */}
          <TabsContent value="checklist" className="mt-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Checklist Semanal - Semana {currentWeek}: {weekData?.subArea}</CardTitle>
                <CardDescription>
                  Clique em cada dia para ver as instruções detalhadas. Marque cada tarefa conforme avança.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition"
                    >
                      {/* Cabeçalho do Dia */}
                      <div
                        onClick={() => setExpandedDay(expandedDay === task.id ? null : task.id)}
                        className="p-4 bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {task.day}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {task.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded">
                            {[task.study, task.practice, task.test, task.review, task.devotional].filter(Boolean).length}/5
                          </div>
                          {expandedDay === task.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Conteúdo Expandido */}
                      {expandedDay === task.id && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                          {/* Estudo */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${task.id}-study`}
                                checked={task.study}
                                onCheckedChange={(checked) =>
                                  updateTask(task.id, "study", checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`${task.id}-study`}
                                className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                              >
                                ☐ Estudo
                              </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 ml-6">
                              {task.studyDesc}
                            </p>
                          </div>

                          {/* Prática */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${task.id}-practice`}
                                checked={task.practice}
                                onCheckedChange={(checked) =>
                                  updateTask(task.id, "practice", checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`${task.id}-practice`}
                                className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                              >
                                ☐ Prática
                              </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 ml-6">
                              {task.practiceDesc}
                            </p>
                          </div>

                          {/* Teste */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${task.id}-test`}
                                checked={task.test}
                                onCheckedChange={(checked) =>
                                  updateTask(task.id, "test", checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`${task.id}-test`}
                                className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                              >
                                ☐ Teste
                              </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 ml-6">
                              {task.testDesc}
                            </p>
                          </div>

                          {/* Revisão */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${task.id}-review`}
                                checked={task.review}
                                onCheckedChange={(checked) =>
                                  updateTask(task.id, "review", checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`${task.id}-review`}
                                className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                              >
                                ☐ Revisão
                              </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 ml-6">
                              {task.reviewDesc}
                            </p>
                          </div>

                          {/* Devocional */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${task.id}-devotional`}
                                checked={task.devotional}
                                onCheckedChange={(checked) =>
                                  updateTask(task.id, "devotional", checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`${task.id}-devotional`}
                                className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
                              >
                                ☐ Devocional
                              </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 ml-6">
                              {task.devotionalDesc}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Progresso */}
          <TabsContent value="progress" className="mt-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Visão Geral de Progresso</CardTitle>
                <CardDescription>
                  Acompanhe seu progresso em todas as 24 semanas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Progresso por Fase</h3>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((phase) => {
                        const phaseWeeks = weeksData.filter((w) => w.phase === phase);
                        const phaseTasks = phaseWeeks.reduce((sum, week) => {
                          const weekTasks = tasks[week.week] || week.tasks;
                          return sum + weekTasks.length * 5;
                        }, 0);
                        const phaseChecked = phaseWeeks.reduce((sum, week) => {
                          const weekTasks = tasks[week.week] || week.tasks;
                          return sum + weekTasks.filter((t) => t.study || t.practice || t.test || t.review || t.devotional).length * 5;
                        }, 0);
                        const phaseProgress = (phaseChecked / phaseTasks) * 100;

                        return (
                          <div key={phase}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Fase {phase} (Semanas {phase === 1 ? "1-6" : phase === 2 ? "7-12" : phase === 3 ? "13-18" : "19-24"})
                              </span>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {Math.round(phaseProgress)}%
                              </span>
                            </div>
                            <Progress value={phaseProgress} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Progresso por Semana</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {weeksData.map((week) => {
                        const weekTasks = tasks[week.week] || week.tasks;
                        const weekTotal = weekTasks.length * 5;
                        const weekChecked = weekTasks.filter((t) => t.study || t.practice || t.test || t.review || t.devotional).length * 5;
                        const weekProgress = (weekChecked / weekTotal) * 100;
                        const isCurrentWeek = week.week === currentWeek;

                        return (
                          <button
                            key={week.week}
                            onClick={() => setCurrentWeek(week.week)}
                            className={`p-2 rounded-lg text-center transition ${
                              isCurrentWeek
                                ? "bg-blue-600 text-white"
                                : weekProgress === 100
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            <div className="text-xs font-bold">S{week.week}</div>
                            <div className="text-xs">{Math.round(weekProgress)}%</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Metas Semanais */}
          <TabsContent value="recursos">
              {weekData && weekData.additionalResources && weekData.additionalResources.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Recursos Adicionais para a Semana {currentWeek}</h3>
                  <p className="text-slate-600 dark:text-slate-400">Aprofunde seu conhecimento com leituras e vídeos selecionados. Você pode buscar por título ou filtrar por tipo.</p>
                  
                  {/* Controles de Busca e Filtro */}
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Input
                      type="text"
                      placeholder="Buscar por título..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                    <Select value={filterType} onValueChange={(value: "Todos" | "Leitura" | "Vídeo") => setFilterType(value)}>
                      <SelectTrigger className="w-[180px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                        <SelectValue placeholder="Filtrar por Tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-700">
                        <SelectItem value="Todos">Todos os Tipos</SelectItem>
                        <SelectItem value="Leitura">Leitura</SelectItem>
                        <SelectItem value="Vídeo">Vídeo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={clearFilters} variant="outline" className="w-full md:w-auto" disabled={searchTerm === "" && filterType === "Todos"}>
                      <X className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>

                  {/* Lista de Recursos Filtrados */}
                  {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResources.map((resource, index) => (
                      <Card key={index} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {resource.type === "Leitura" ? (
                              <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-500 dark:text-red-400"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 dark:text-white">{resource.type}</p>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">
                              {resource.title}
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">Nenhum Recurso Encontrado</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Ajuste os termos de busca ou o filtro de tipo.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">Nenhum Recurso Adicional Encontrado</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">Os recursos para esta semana serão adicionados em breve.</p>
                </div>
              )}
            </TabsContent>

          <TabsContent value="goals">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Metas Semanais</CardTitle>
                <CardDescription>
                  Defina e acompanhe suas metas para a Semana {currentWeek}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                      Meta para a Semana {currentWeek}
                    </label>
                    <Textarea
                      value={weeklyGoal}
                      onChange={(e) => setWeeklyGoal(e.target.value)}
                      placeholder={`Ex: ${weekData?.objective || "Completar todos os estudos da semana"}`}
                      className="min-h-24 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Dica: Como Definir Boas Metas
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>✓ Seja específico: não apenas "estudar", mas "dominar {weekData?.subArea}"</li>
                      <li>✓ Seja mensurável: "conseguir explicar em 5 minutos"</li>
                      <li>✓ Seja realista: considere as 2 horas diárias disponíveis</li>
                      <li>✓ Alinhe com o objetivo final: "ensino"</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {completedDays}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Dias Completos</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {Math.round(generalProgress)}%
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Progresso</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentWeek}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Semana Atual</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {24 - currentWeek}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Restantes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Feedback Pessoal */}
          <TabsContent value="feedback" className="mt-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Campo de Feedback Pessoal</CardTitle>
                <CardDescription>
                  Registre suas reflexões, dificuldades e insights sobre o aprendizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escreva aqui seus pensamentos, dificuldades encontradas, insights importantes, ou qualquer coisa que queira registrar sobre sua jornada de aprendizado..."
                    className="min-h-32 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  />

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Perguntas para Reflexão
                    </h4>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• O que foi mais desafiador hoje?</li>
                      <li>• Qual foi o insight mais importante?</li>
                      <li>• Como posso aplicar isso na prática?</li>
                      <li>• Preciso revisar algum conceito?</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Sistema Anti-Procrastinação
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                      Regra das 2 Horas Inegociáveis: O estudo deve ser agendado no calendário como um
                      compromisso fixo.
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Se falhar, a recuperação deve ocorrer no dia seguinte, antes do novo estudo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Cronograma Diário Sugerido (2 Horas)</CardTitle>
                <CardDescription>
                  Distribuição de tempo para um estudo focado e sustentável de Segunda a Sexta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    **Total Diário:** 2 horas (12 horas semanais)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Módulo</th>
                          <th className="py-2 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Foco</th>
                          <th className="py-2 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Tempo Sugerido</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 px-4 font-medium">Devocional</td>
                          <td className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400">Oração e Leitura Bíblica (Não-Estudo)</td>
                          <td className="py-2 px-4 font-medium text-blue-600 dark:text-blue-400">30 min</td>
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 px-4 font-medium">Estudo (Leitura/Pesquisa)</td>
                          <td className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400">Absorção de novo conteúdo e anotações</td>
                          <td className="py-2 px-4 font-medium text-blue-600 dark:text-blue-400">45 min</td>
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 px-4 font-medium">Prática (Exercício/Resumo)</td>
                          <td className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400">Aplicação, síntese e produção de conteúdo</td>
                          <td className="py-2 px-4 font-medium text-blue-600 dark:text-blue-400">30 min</td>
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 px-4 font-medium">Teste (Avaliação/Questionário)</td>
                          <td className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400">Verificação rápida de aprendizado e identificação de lacunas</td>
                          <td className="py-2 px-4 font-medium text-blue-600 dark:text-blue-400">15 min</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-medium">Revisão (Notas)</td>
                          <td className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400">Fixação e retenção do conteúdo do dia</td>
                          <td className="py-2 px-4 font-medium text-blue-600 dark:text-blue-400">15 min</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-md">
                    <p className="font-semibold text-blue-800 dark:text-blue-200">Sábado e Domingo:</p>
                    <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 ml-4">
                      <li>**Sábado:** 2 horas para Revisão Semanal, Teste Semanal ou recuperação de tarefas pendentes.</li>
                      <li>**Domingo:** Dia de Descanso e Contemplação (0 horas de estudo formal).</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rodapé com Informações */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Estrutura das Fases</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              <p>
                <strong>Fase 1 (Semanas 1-6):</strong> Teologia Sistemática - Fundamentos
              </p>
              <p className="mt-2">
                <strong>Fase 2 (Semanas 7-12):</strong> Teologia Sistemática - Conclusão + Bíblica
              </p>
              <p className="mt-2">
                <strong>Fase 3 (Semanas 13-18):</strong> Teologia Histórica
              </p>
              <p className="mt-2">
                <strong>Fase 4 (Semanas 19-24):</strong> Teologia Prática e Revisão
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Dicas de Sucesso</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-1">
                <li>✓ Estude sempre no mesmo horário</li>
                <li>✓ Use a técnica Pomodoro (50/10)</li>
                <li>✓ Crie flashcards para recuperação ativa</li>
                <li>✓ Pratique explicando para alguém</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
